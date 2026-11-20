<?php

declare(strict_types=1);

namespace Domain\Memory\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Memory\Enums\MemoryAbility;
use Domain\Memory\Handlers\SaveMemoryHandler;
use Domain\Memory\Models\Memory;
use Domain\Memory\Policies\MemoryPolicy;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Keeps a memory for the calling actor at a weight and answers its id; sent again under the same request key, the
 * bus answers the first id from its receipt.
 *
 * @extends Command<string>
 */
#[HandledBy(SaveMemoryHandler::class)]
#[Authorize(MemoryPolicy::class, MemoryAbility::Work)]
final readonly class SaveMemory extends Command implements HasAuthorizationSubject
{
    public function __construct(
        #[Required]
        public string $text,
        #[Between(Memory::LIGHTEST, Memory::HEAVIEST)]
        public int $weight,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Memory::class;
    }
}
