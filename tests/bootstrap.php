<?php

declare(strict_types=1);

/*
 * The tests run only inside the project's Docker containers, against their Postgres and Redis; on the host they would
 * reach other services or none, so a run outside Docker stops here with the command to use instead.
 */
if (! file_exists('/.dockerenv')) {
    fwrite(STDERR, "The tests run only inside Docker: docker compose -p agent-journal-6 exec -T queue composer test\n");

    exit(1);
}

require __DIR__.'/../vendor/autoload.php';
