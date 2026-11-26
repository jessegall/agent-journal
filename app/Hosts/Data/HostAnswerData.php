<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use App\Hosts\Enums\HostOrderStatus;
use App\Hosts\Enums\HostRefusal;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A host's answer to one order: done, or refused for a reason, with the facts it saw, such as the current hash of the
 * guarded rows and the input generation.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HostAnswerData extends Data
{
    /**
     * @param  array<string, mixed>  $facts
     */
    public function __construct(
        public readonly HostOrderStatus $status,
        public readonly HostRefusal|null $refusal = null,
        public readonly array $facts = [],
    ) {}

    public function isRefused(): bool
    {
        return $this->status === HostOrderStatus::Refused;
    }

    /**
     * Why the host refused: a refusal that names no reason is taken as unsafe, the host's own answer to an order it
     * does not trust.
     */
    public function refusalReason(): HostRefusal
    {
        return $this->refusal ?? HostRefusal::Unsafe;
    }
}
