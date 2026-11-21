<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Programs\Enums\HookProgram;

/**
 * What a contained host found of a program's protected arrangement in the agent image (journal-agent protection),
 * item by item; a program no contained host has reported has no items.
 *
 * @phpstan-import-type StoredItem from ProtectedItem
 *
 * @phpstan-type StoredReport array{program: string, build: string, platform: string, items: list<StoredItem>}
 */
final readonly class ProtectionReport
{
    // The platform a contained host's tools run on, as journal-agent names it.
    public const string CONTAINER_PLATFORM = 'linux-container';

    /**
     * @param  list<ProtectedItem>  $items
     */
    public function __construct(
        public HookProgram $program,
        public string $build,
        public string $platform,
        public array $items,
    ) {}

    /**
     * The report of a program and build no contained host has reported on.
     */
    public static function unreported(HookProgram $program, string $build): self
    {
        return new self($program, $build, '', []);
    }

    /**
     * @param  StoredReport  $stored
     */
    public static function fromStored(array $stored): self
    {
        return new self(
            HookProgram::from($stored['program']),
            $stored['build'],
            $stored['platform'],
            array_map(ProtectedItem::fromStored(...), $stored['items']),
        );
    }

    /**
     * The key a host keeps a report under, one per program and build.
     */
    public static function keyOf(HookProgram $program, string $build): string
    {
        return "{$program->value}@{$build}";
    }

    /**
     * @return StoredReport
     */
    public function stored(): array
    {
        return [
            'program' => $this->program->value,
            'build' => $this->build,
            'platform' => $this->platform,
            'items' => array_map(fn (ProtectedItem $item): array => $item->stored(), $this->items),
        ];
    }

    /**
     * Whether every item is kept from the tools in the agent container, each shown by a native run.
     */
    public function isEnforcedInContainer(): bool
    {
        return $this->platform === self::CONTAINER_PLATFORM && $this->items !== [] && $this->unenforced() === [];
    }

    /**
     * What stands between this program and a contained start, for the refusal to name.
     */
    public function shortfall(): string
    {
        if ($this->items === []) {
            return "no contained host has reported the protection of {$this->program->value} {$this->build} in the "
                .'agent image (journal-agent protection --arrangement=contained)';
        }

        if ($this->platform !== self::CONTAINER_PLATFORM) {
            return "the protection report of {$this->program->value} {$this->build} is for {$this->platform}, not the "
                .'agent container';
        }

        $unenforced = $this->unenforced();

        return "the agent image's protection report leaves ".implode(', ', array_column($unenforced, 'item'))
            ." unenforced: {$unenforced[0]->reason}";
    }

    /**
     * @return list<ProtectedItem>
     */
    private function unenforced(): array
    {
        return array_values(array_filter($this->items, fn (ProtectedItem $item): bool => ! $item->enforced));
    }
}
