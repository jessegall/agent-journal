<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Drivers\Enums\BoundaryItem;
use App\Agents\Exceptions\DriverSetupInvalid;

/**
 * One mechanism for every boundary item of a driver on a platform.
 */
final readonly class BoundaryMechanisms
{
    /**
     * @param  array<string, BoundaryMechanism>  $mechanisms  by item value
     *
     * @throws DriverSetupInvalid
     */
    public function __construct(private array $mechanisms)
    {
        foreach (BoundaryItem::cases() as $item) {
            if (! array_key_exists($item->value, $mechanisms)) {
                throw DriverSetupInvalid::itemWithoutMechanism($item->value);
            }
        }
    }

    public static function allUnavailable(string $why): self
    {
        $items = array_map(fn (BoundaryItem $item) => $item->value, BoundaryItem::cases());

        return new self(array_fill_keys($items, BoundaryMechanism::unavailable($why)));
    }

    /**
     * Every item unenforced: outside the protected container the driver and the commands it runs share one user.
     */
    public static function unconfined(): self
    {
        return self::allUnavailable(
            'the journal confines a session only in the protected container; elsewhere the driver and the commands it '
            .'runs share one user',
        );
    }

    public function of(BoundaryItem $item): BoundaryMechanism
    {
        return $this->mechanisms[$item->value];
    }

    public function with(BoundaryItem $item, BoundaryMechanism $mechanism): self
    {
        return new self([...$this->mechanisms, $item->value => $mechanism]);
    }
}
