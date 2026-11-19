<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Desks\Models\DeskRecord;

/**
 * The desks Core installs: main, where the main agent sits, and one source desk for each principal without a row.
 */
final readonly class BuiltInDesks
{
    public const string MAIN = 'main';

    /**
     * The source desk of each rowless principal, named after its actor type.
     *
     * @var array<string, array{string, string}>
     */
    public const array SOURCES = [
        'system' => ['system', 'System'],
        'engine' => ['engine', 'Engine'],
    ];

    public function install(): void
    {
        DeskRecord::installNamed(self::MAIN, 'Main inbox', 1, true);

        foreach (self::SOURCES as [$name, $label]) {
            DeskRecord::installSourceDesk($name, $label);
        }
    }
}
