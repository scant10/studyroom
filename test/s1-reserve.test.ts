import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.ts";
import { start } from "./helpers.ts";

test("시나리오: 정상 경로 - 예약 성공", async () => {
  const app = await start(createApp());

  const res = await app.call("POST", "/api/reservations", {
    headers: { "X-Member-Id": "user1" },
    body: {
      roomId: "A",
      date: "2026-11-18",
      startTime: "14:00",
      endTime: "16:00",
    },
  });

  assert.equal(res.status, 201);
  assert.ok(res.body.id);
  assert.equal(res.body.roomId, "A");
  assert.equal(res.body.date, "2026-11-18");
  assert.equal(res.body.startTime, "14:00");
  assert.equal(res.body.endTime, "16:00");
  assert.equal(res.body.memberId, "user1");

  await app.close();
});

test("시나리오: 예외 경로 1 - 시간 겹침", async () => {
  const app = await start(createApp());

  await app.call("POST", "/api/reservations", {
    headers: { "X-Member-Id": "user1" },
    body: {
      roomId: "A",
      date: "2026-11-18",
      startTime: "14:00",
      endTime: "16:00",
    },
  });

  const res = await app.call("POST", "/api/reservations", {
    headers: { "X-Member-Id": "user2" },
    body: {
      roomId: "A",
      date: "2026-11-18",
      startTime: "15:00",
      endTime: "17:00",
    },
  });

  assert.equal(res.status, 409);
  assert.deepEqual(res.body, {
    code: "RESERVATION_CONFLICT",
    message: "해당 시간에 이미 예약이 있습니다.",
  });

  await app.close();
});

test("시나리오: 예외 경로 2 - 인증 헤더 없음", async () => {
  const app = await start(createApp());

  const res = await app.call("POST", "/api/reservations", {
    body: {
      roomId: "A",
      date: "2026-11-18",
      startTime: "14:00",
      endTime: "16:00",
    },
  });

  assert.equal(res.status, 401);
  assert.deepEqual(res.body, {
    code: "UNAUTHORIZED",
    message: "회원 인증이 필요합니다.",
  });

  await app.close();
});

test("시나리오: 예외 경로 3 - 존재하지 않는 룸", async () => {
  const app = await start(createApp());

  const res = await app.call("POST", "/api/reservations", {
    headers: { "X-Member-Id": "user1" },
    body: {
      roomId: "X",
      date: "2026-11-18",
      startTime: "14:00",
      endTime: "16:00",
    },
  });

  assert.equal(res.status, 404);
  assert.deepEqual(res.body, {
    code: "ROOM_NOT_FOUND",
    message: "존재하지 않는 룸입니다.",
  });

  await app.close();
});

test("시나리오: 예외 경로 4 - 과거 시각 예약", async () => {
  const now = () => new Date("2026-11-18T15:00:00+09:00");
  const app = await start(createApp({ now }));

  const res = await app.call("POST", "/api/reservations", {
    headers: { "X-Member-Id": "user1" },
    body: {
      roomId: "A",
      date: "2026-11-18",
      startTime: "14:00",
      endTime: "15:00",
    },
  });

  assert.equal(res.status, 400);
  assert.deepEqual(res.body, {
    code: "INVALID_TIME",
    message: "과거 시각은 예약할 수 없습니다.",
  });

  await app.close();
});

test("시나리오: 예외 경로 5 - 운영 시간 외", async () => {
  const app = await start(createApp());

  const res = await app.call("POST", "/api/reservations", {
    headers: { "X-Member-Id": "user1" },
    body: {
      roomId: "A",
      date: "2026-11-18",
      startTime: "08:00",
      endTime: "09:00",
    },
  });

  assert.equal(res.status, 400);
  assert.deepEqual(res.body, {
    code: "INVALID_TIME",
    message: "운영 시간(09:00-22:00)을 벗어났습니다.",
  });

  await app.close();
});

test("시나리오: 예외 경로 6 - 최대 시간 초과", async () => {
  const app = await start(createApp());

  const res = await app.call("POST", "/api/reservations", {
    headers: { "X-Member-Id": "user1" },
    body: {
      roomId: "A",
      date: "2026-11-18",
      startTime: "10:00",
      endTime: "15:00",
    },
  });

  assert.equal(res.status, 400);
  assert.deepEqual(res.body, {
    code: "INVALID_TIME",
    message: "최대 4시간까지만 예약할 수 있습니다.",
  });

  await app.close();
});
