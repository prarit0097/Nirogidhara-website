"use server";

import { revalidatePath } from "next/cache";
import { generateDailyContent } from "../../lib/generator";
import { setSetting, updatePostStatus } from "../../lib/db";

export async function runDailyNow() {
  await generateDailyContent();
  revalidatePath("/admin");
  revalidatePath("/en");
  revalidatePath("/hi");
}

export async function pauseAutomation() {
  setSetting("automation_paused", "true");
  revalidatePath("/admin");
}

export async function resumeAutomation() {
  setSetting("automation_paused", "false");
  revalidatePath("/admin");
}

export async function publishPost(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) updatePostStatus(id, "published");
  revalidatePath("/admin");
}

export async function unpublishPost(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) updatePostStatus(id, "unpublished");
  revalidatePath("/admin");
}
