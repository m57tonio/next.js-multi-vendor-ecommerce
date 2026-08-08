import { prisma } from "@/lib/prisma";

/**
 * Find the ONE conversation for a (customer, vendor) pair, or create it. The
 * unique (customerId, vendorId) constraint guarantees reuse — "Chat with vendor"
 * for an existing pair reopens the SAME thread, never a duplicate. `productId`
 * is stored only as first-contact context on creation and never overwritten on
 * reuse. Returns the conversation id.
 */
export async function findOrCreateConversation(
  customerId: string,
  vendorId: string,
  productId?: string,
): Promise<{ id: string }> {
  return prisma.conversation.upsert({
    where: { customerId_vendorId: { customerId, vendorId } },
    update: {}, // reuse as-is — don't touch productId or lastMessageAt here
    create: { customerId, vendorId, productId: productId ?? null },
    select: { id: true },
  });
}
