<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Agents\Enums\DriverVariant;
use App\Drivers\Contracts\DriverCatalogue;
use App\Drivers\Enums\DriverCapability;
use App\Drivers\Values\BoundTarget;
use App\Drivers\Values\DriverRegistration;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One registered driver a start or switch form offers: its key and label, the family and mode a start sends, and
 * whether it can run now, with the reason when it cannot.
 */
#[TypeScript]
final class DriverChoiceData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly string $family,
        public readonly DriverVariant $mode,
        public readonly bool $isAvailable,
        public readonly string|null $unavailableReason,
    ) {}

    /**
     * Every registered driver, in the catalogue's order.
     *
     * @return list<self>
     */
    public static function listed(DriverCatalogue $drivers): array
    {
        return array_map(
            fn (DriverRegistration $registration) => self::of($drivers, $registration),
            $drivers->catalogue(),
        );
    }

    private static function of(DriverCatalogue $drivers, DriverRegistration $registration): self
    {
        $run = $drivers->forKey($registration->key)
            ->capabilities(BoundTarget::beforePlacement())
            ->supportOf(DriverCapability::Run);

        return new self(
            (string) $registration->key,
            $registration->label,
            $registration->family,
            $registration->mode,
            $run->isAllowed(),
            $run->isAllowed() ? null : $run->reason,
        );
    }
}
