import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, InsertVideo, InsertProduct, InsertValidationReport, users, videos, products, validationReports } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get or create an anonymous user for videos without authentication
 * Returns the user ID (defaults to 1 for anonymous user)
 */
export async function getOrCreateAnonymousUser(): Promise<number> {
  const db = await getDb();
  if (!db) {
    // If database is not available, return a default ID
    // This allows the app to work without database (videos won't be saved)
    console.warn("[Database] Database not available, using default anonymous user ID");
    return 1;
  }

  const ANONYMOUS_OPEN_ID = "__anonymous__";
  
  try {
    // Try to get existing anonymous user
    let anonymousUser = await getUserByOpenId(ANONYMOUS_OPEN_ID);
    
    if (!anonymousUser) {
      // Create anonymous user if it doesn't exist
      try {
        await upsertUser({
          openId: ANONYMOUS_OPEN_ID,
          name: "Usuário Anônimo",
          role: "user",
        });
        anonymousUser = await getUserByOpenId(ANONYMOUS_OPEN_ID);
      } catch (error) {
        console.error("[Database] Failed to create anonymous user:", error);
        // Return default ID if creation fails
        return 1;
      }
    }

    return anonymousUser?.id || 1;
  } catch (error) {
    console.error("[Database] Error getting anonymous user:", error);
    // Return default ID if query fails
    return 1;
  }
}

export async function createVideo(data: InsertVideo) {
  const db = await getDb();
  if (!db) {
    // Return a mock result if database is not available
    console.warn("[Database] Database not available, video will not be saved");
    return { insertId: 0 };
  }
  
  try {
    const result = await db.insert(videos).values(data);
    // Drizzle returns an array with insertId property
    return { insertId: (result as any)[0]?.insertId || 0 };
  } catch (error) {
    console.error("[Database] Failed to create video:", error);
    throw error;
  }
}

export async function getVideoById(videoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(videos).where(eq(videos.id, videoId)).limit(1);
  return result[0];
}

export async function getVideosByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(videos).where(eq(videos.userId, userId)).orderBy(desc(videos.createdAt));
}

export async function getAllVideos() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Database not available, returning empty array");
    return [];
  }
  
  try {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get videos:", error);
    return [];
  }
}

export async function updateVideoStatus(videoId: number, status: string, data?: Partial<InsertVideo>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Database not available, video status will not be updated");
    return;
  }
  
  try {
    return await db.update(videos).set({ status: status as any, ...data }).where(eq(videos.id, videoId));
  } catch (error) {
    console.error("[Database] Failed to update video status:", error);
    throw error;
  }
}

export async function createProducts(videoId: number, productsList: InsertProduct[]) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Database not available, products will not be saved");
    return;
  }
  
  try {
    return await db.insert(products).values(productsList.map(p => ({ ...p, videoId })));
  } catch (error) {
    console.error("[Database] Failed to create products:", error);
    throw error;
  }
}

export async function getProductsByVideoId(videoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(products).where(eq(products.videoId, videoId));
}

export async function createValidationReport(data: InsertValidationReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(validationReports).values(data);
}

export async function getValidationReportsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(validationReports).where(eq(validationReports.userId, userId)).orderBy(desc(validationReports.createdAt));
}

export async function getAllReports() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(validationReports).orderBy(desc(validationReports.createdAt));
}

// TODO: add feature queries here as your schema grows.
