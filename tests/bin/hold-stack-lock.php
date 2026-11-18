<?php

declare(strict_types=1);

/*
 * A separate process for the hook lock tests: it locks one stack row, prints "locked", waits, pushes one task frame
 * onto the stack as a domain listener would, and commits. The database settings come from the environment.
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

usleep((int) $environment('LOCK_HOLD_MILLISECONDS') * 1000);

$frames = json_decode((string) $row['frames'], true, flags: JSON_THROW_ON_ERROR);
$frames['frames'][] = [
    'id' => 'pushed-by-other-process',
    'typeKey' => 'test.tasks',
    'schemaVersion' => 1,
    'isBottom' => false,
    'subject' => ['id' => (string) $environment('LOCK_TASK_NUMBER'), 'runNumber' => 1],
];

$update = $database->prepare('UPDATE agent_stacks SET frames = ?, version = version + 1 WHERE id = ?');
$update->execute([json_encode($frames, JSON_THROW_ON_ERROR), $row['id']]);
$database->commit();

fwrite(STDOUT, "committed\n");
