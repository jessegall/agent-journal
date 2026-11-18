<?php

declare(strict_types=1);

/*
 * A separate process for the hook lock tests: it locks one stack row, prints "locked", holds the lock until another
 * connection is seen waiting for it, pushes one task frame onto the stack as a domain listener would, and commits.
 * It orders the two processes by the database's own state, never by a delay. The settings come from the environment.
 */

$environment = static fn (string $name): string => (string) getenv($name);

$database = new PDO(
    sprintf('pgsql:host=%s;port=%s;dbname=%s', $environment('LOCK_DB_HOST'), $environment('LOCK_DB_PORT'), $environment('LOCK_DB_DATABASE')),
    $environment('LOCK_DB_USERNAME'),
    $environment('LOCK_DB_PASSWORD'),
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION],
);

$database->beginTransaction();

$select = $database->prepare('SELECT id, frames FROM agent_stacks WHERE agent_id = ? AND session_id = ? FOR UPDATE');
$select->execute([(string) $environment('LOCK_AGENT_ID'), (string) $environment('LOCK_SESSION_ID')]);
$row = $select->fetch(PDO::FETCH_ASSOC);

fwrite(STDOUT, "locked\n");
fflush(STDOUT);

$waiting = $database->prepare("SELECT count(*) FROM pg_stat_activity WHERE wait_event_type = 'Lock' AND datname = current_database() AND pid <> pg_backend_pid()");

$clearSnapshot = $database->prepare('SELECT pg_stat_clear_snapshot()');

// Inside a transaction Postgres keeps one activity snapshot; clear it so each check sees the waiting hook.
for ($attempt = 0; $attempt < 100_000; $attempt++) {
    $clearSnapshot->execute();
    $waiting->execute();

    if ((int) $waiting->fetchColumn() > 0) {
        break;
    }
}

fwrite(STDOUT, "saw the hook waiting\n");

$frames = json_decode((string) $row['frames'], true, flags: JSON_THROW_ON_ERROR);
$frames['frames'][] = [
    'id' => 'pushed-by-other-process',
    'typeKey' => 'test.tasks',
    'schemaVersion' => 1,
    'isBottom' => false,
    'subject' => ['id' => (string) $environment('LOCK_TASK_NUMBER'), 'runNumber' => 1],
    'enteredAt' => (new DateTimeImmutable)->format('Y-m-d\\TH:i:s.uP'),
];

$update = $database->prepare('UPDATE agent_stacks SET frames = ?, version = version + 1 WHERE id = ?');
$update->execute([json_encode($frames, JSON_THROW_ON_ERROR), $row['id']]);
$database->commit();

fwrite(STDOUT, "committed\n");
