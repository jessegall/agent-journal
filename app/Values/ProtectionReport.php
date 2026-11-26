<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Drivers\Enums\BoundaryItem;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Agents\Drivers\Enums\StartProfileType;
use App\Agents\Values\BoundaryMechanisms;
use App\Profiles\Data\ProtectedItemData;
use App\Profiles\Data\ProtectionReportData;
use App\Profiles\Values\ProtectedItem;
use App\Projects\Values\ProtectionEvidence;

/**
 * What a contained host found of a driver's protected arrangement in the agent image (journal-agent protection),
 * item by item; a driver no contained host has reported has no items.
 */
final readonly class ProtectionReport
{
    /**
     * @param  list<ProtectedItem>  $items
     */
    public function __construct(
        public string $driver,
        public string $build,
        public string $platform,
        public array $items,
    ) {}

    /**
     * The report of a driver, build and platform no contained host has reported on.
     */
    public static function unreported(string $driver, string $build, string $platform): self
    {
        return new self($driver, $build, $platform, []);
    }

    /**
     * The report of a driver's build on a platform, each item judged from the platform's mechanisms and the host's
     * recorded runs.
     */
    public static function judge(
        string $driver,
        string $build,
        IsolationPlatform $platform,
        BoundaryMechanisms $mechanisms,
        ProtectionEvidence $evidence,
    ): self {
        $key = self::keyOf($driver, $build, $platform->value);

        $judged = fn (BoundaryItem $item) => ProtectedItem::judged(
            $item,
            $mechanisms->of($item),
            $evidence->runOf($key, $item),
        );

        $items = array_map($judged, BoundaryItem::cases());

        return new self($driver, $build, $platform->value, $items);
    }

    /**
     * The key a host keeps a report under, one per driver, build and platform; the standard container's keeps the
     * key reports had before protected starts had their own.
     */
    private static function keyOf(string $driver, string $build, string $platform): string
    {
        if ($platform === StartProfileType::Standard->protectionPlatform()->value) {
            return "{$driver}@{$build}";
        }

        return "{$driver}@{$build}/{$platform}";
    }

    /**
     * The key this report is kept under.
     */
    public function key(): string
    {
        return self::keyOf($this->driver, $this->build, $this->platform);
    }

    /**
     * The report as a host row keeps it.
     */
    public function data(): ProtectionReportData
    {
        $items = array_map(fn (ProtectedItem $item) => ProtectedItemData::from([
            'item' => $item->item,
            'isEnforced' => $item->isEnforced,
            'evidence' => $item->evidence,
            'reason' => $item->reason,
        ]), $this->items);

        return new ProtectionReportData($this->driver, $this->build, $this->platform, $items);
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
     * Whether the pinned client has a native mechanism for every item and all that is missing is the recorded run that
     * shows each hold on this agent image: the state a protected-account trial starts in, to make that run.
     */
    public function awaitsEvidenceOnly(): bool
    {
        return $this->items !== [] && array_all(
            $this->unenforced(),
            fn (ProtectedItem $item) => $item->awaitsEvidenceOnly(),
        );
    }

    /**
     * What stands between this driver and a contained start, for the refusal to name.
     */
    public function shortfall(): string
    {
        if ($this->items === []) {
            return "no contained host has reported the protection of {$this->driver} {$this->build} in the "
                ."agent image for {$this->platform}";
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
        return array_values(array_filter($this->items, fn (ProtectedItem $item) => ! $item->isEnforced));
    }
}
