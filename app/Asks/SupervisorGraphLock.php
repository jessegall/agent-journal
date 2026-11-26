<?php

declare(strict_types=1);

namespace App\Asks;

use Illuminate\Database\ConnectionInterface;

final readonly class SupervisorGraphLock
{
    private const string KEY = 'journal.supervisor-routes';

    public function __construct(private ConnectionInterface $database) {}

    public function acquire(): void
    {
        $this->database->statement('select pg_advisory_xact_lock(hashtext(?))', [self::KEY]);
    }
}
