<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The desks Core installs: main, where the main agent sits, and one source desk for each principal without a row.
 */
final readonly class BuiltInDesks
{
    public function __construct(private DeskOpening $desks) {}

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
        $this->desks->installNamed(self::MAIN, 'Main inbox', 1, true);

        foreach (self::SOURCES as [$name, $label]) {
            $this->desks->installSourceDesk($name, $label);
        }
    }
}
