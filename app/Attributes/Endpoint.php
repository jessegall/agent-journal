<?php

declare(strict_types=1);

namespace App\Attributes;

use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
use Attribute;
use Spatie\LaravelData\Data;
use Throwable;

/**
 * Where a signed call goes and what it does: its path and method, the Data it is answered with, its effect, who keeps
 * the receipt of a keyed write, the refusals it may answer and the most bytes its answer may hold.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class Endpoint
{
    /**
     * @param  class-string<Data>  $answer
     * @param  list<class-string<Throwable>>  $refusals
     */
    public function __construct(
        public string $path,
        public string $method,
        public string $answer,
        public CallEffect $effect,
        public ReceiptOwner|null $receipt = null,
        public array $refusals = [],
        public int $answerLimit = 10_000_000,
    ) {}
}
