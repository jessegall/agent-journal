<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\LaunchProfileType;
use App\Drivers\Enums\HookDriver;

/**
 * What a contained host found of a driver's protected arrangement in the agent image (journal-agent protection),
 * item by item; a driver no contained host has reported has no items.
 *
 * @phpstan-import-type StoredItem from ProtectedItem
 *
 * @phpstan-type StoredReport array{driver: string, build: string, platform: string, items: list<StoredItem>}
 */
final readonly class ProtectionReport
{
    /**
     * @param  list<ProtectedItem>  $items
     */
    public function __construct(
        public HookDriver $driver,
        public string $build,
        public string $platform,
        public array $items,
    ) {}

    /**
     * The report of a driver, build and platform no contained host has reported on.
     */
    public static function unreported(HookDriver $driver, string $build, string $platform): self
    {
        return new self($driver, $build, $platform, []);
    }

    /**
     * @param  StoredReport  $stored
     */
    public static function fromStored(array $stored): self
    {
        return new self(
            HookDriver::from($stored['driver']),
            $stored['build'],
            $stored['platform'],
            array_map(ProtectedItem::fromStored(...), $stored['items']),
        );
    }

    /**
     * The key a host keeps a report under, one per driver, build and platform; the standard container's keeps the
     * key reports had before protected starts had their own.
     */
    public static function keyOf(HookDriver $driver, string $build, string $platform): string
    {
        return $platform === LaunchProfileType::Standard->protectionPlatform()
            ? "{$driver->value}@{$build}"
            : "{$driver->value}@{$build}/{$platform}";
    }

    /**
     * The key this report is kept under.
     */
    public function key(): string
    {
        return self::keyOf($this->driver, $this->build, $this->platform);
    }

    /**
     * @return StoredReport
     */
    public function stored(): array
    {
        return [
            'driver' => $this->driver->value,
            'build' => $this->build,
            'platform' => $this->platform,
            'items' => array_map(fn (ProtectedItem $item): array => $item->stored(), $this->items),
        ];
    }

    /**
     * Whether a contained host reported this build's protection at all.
     */
    public function isReported(): bool
    {
        return $this->items !== [];
    }

    /**
     * Whether every item is kept from the tools in the agent container, each shown by a native run.
     */
    public function isEnforcedInContainer(): bool
    {
        return $this->items !== [] && $this->unenforced() === [];
    }

    /**
     * What stands between this driver and a contained start, for the refusal to name.
     */
    public function shortfall(): string
    {
        if ($this->items === []) {
            return "no contained host has reported the protection of {$this->driver->value} {$this->build} in the "
                ."agent image for {$this->platform} (journal-agent protection --arrangement=contained)";
        }

        $unenforced = $this->unenforced();

        return "the agent image's protection report leaves ".implode(', ', array_column($unenforced, 'item'))
            ." unenforced ({$unenforced[0]->reason})";
    }

    /**
     * @return list<ProtectedItem>
     */
    private function unenforced(): array
    {
        return array_values(array_filter($this->items, fn (ProtectedItem $item): bool => ! $item->enforced));
    }
}
