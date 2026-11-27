<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a contained plan may not name, as it names nothing of the host it runs on.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HostContainedPlanData extends Data
{
    /**
     * @param  list<string>  $refusedFields  the plan fields it may not set
     */
    public function __construct(public readonly string $about, public readonly array $refusedFields) {}
}
