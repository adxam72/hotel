import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("rooms router", () => {
  it("should list all rooms", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const rooms = await caller.rooms.list();
    expect(Array.isArray(rooms)).toBe(true);
  });

  it("should create room as admin", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.rooms.create({
      name: "Test Room",
      description: "Test Description",
      price: "100,000 so'm",
      imageUrl: "https://example.com/image.jpg",
    });

    expect(result).toBeDefined();
  });

  it("should not allow non-admin to create room", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.rooms.create({
        name: "Test Room",
        description: "Test Description",
        price: "100,000 so'm",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});

describe("reviews router", () => {
  it("should list all reviews", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const reviews = await caller.reviews.list();
    expect(Array.isArray(reviews)).toBe(true);
  });

  it("should create review as public user", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.create({
      name: "Test User",
      rating: 5,
      comment: "Great hotel!",
    });

    expect(result).toBeDefined();
  });

  it("should validate rating between 1-5", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.reviews.create({
        name: "Test User",
        rating: 10,
        comment: "Invalid rating",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("rating");
    }
  });
});
