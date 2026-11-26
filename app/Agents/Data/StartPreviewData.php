<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Drivers\Enums\DriverSourceType;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\DriverTypeSource;
use App\Agents\Values\StartPreview;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the start form shows of a start before it is sent: the driver it resolves to and its label, where its family
 * and driver type came from, whether it can run and why not, whether its driver type is locked, and the revision to send back.
 */
#[TypeScript]
final class StartPreviewData extends Data
{
    public function __construct(
        public readonly string $family,
        public readonly DriverSourceType $familySource,
        public readonly DriverType $driverType,
        public readonly DriverTypeSource $driverTypeSource,
        public readonly string|null $driverKey,
        public readonly string $label,
        public readonly bool $canRun,
        public readonly string|null $unavailableReason,
        public readonly bool $isModeLocked,
        public readonly int $catalogueRevision,
    ) {}

    public static function fromPreview(StartPreview $preview): self
    {
        return self::from([
            'family' => $preview->selection->driver,
            'familySource' => $preview->familySource(),
            'driverType' => $preview->driverType,
            'driverTypeSource' => $preview->driverTypeSource,
            'driverKey' => $preview->driverKey,
            'label' => $preview->label,
            'canRun' => $preview->canRun(),
            'unavailableReason' => $preview->unavailableReason,
            'isModeLocked' => $preview->isModeLocked,
            'catalogueRevision' => $preview->catalogueRevision,
        ]);
    }
}
