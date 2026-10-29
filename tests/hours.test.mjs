import { test } from "node:test";
import assert from "node:assert/strict";
import { openStatus, minutesInSaoPaulo } from "../src/lib/hours.js";

// Brasília = UTC-3 (sem horário de verão desde 2019)
const at = (hhmm) => new Date(`2026-10-29T${hhmm}:00-03:00`);
const H = { open: "18:30", close: "23:00" };

test("converte para o fuso de São Paulo independente do fuso local", () => {
  assert.equal(minutesInSaoPaulo(new Date("2026-10-29T21:30:00Z")), 18 * 60 + 30);
});

test("status antes, durante e depois do horário", () => {
  assert.deepEqual(openStatus(H, at("17:00")), { open: false, label: "Fechada · abre hoje às 18:30" });
  assert.equal(openStatus(H, at("18:30")).open, true);
  assert.equal(openStatus(H, at("23:00")).open, true);
  assert.deepEqual(openStatus(H, at("23:01")), { open: false, label: "Fechada · abre amanhã às 18:30" });
  assert.equal(openStatus({ open: "19:00", close: "23:59" }, at("23:59")).open, true);
});
