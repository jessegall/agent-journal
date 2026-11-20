<?php

declare(strict_types=1);

namespace Domain\Memory\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Memory\Enums\MemoryAbility;
use Domain\Memory\Handlers\EditMemoryHandler;
use Domain\Memory\Models\Memory;
use Domain\Memory\Policies\MemoryPolicy;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\Filled;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;

/**
 * Rewrites the text, the weight or both of one of the calling actor's memories at the revision the caller read, and
 * answers its id.
 *
 * @extends Command<string>
 */
#[HandledBy(EditMemoryHandler::class)]
#[Operation('edit_memory', ResourceAreaType::JournalContent, AccessType::Edit)]
#[Authorize(MemoryPolicy::class, MemoryAbility::Work)]
final readonly class EditMemory extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $memoryId,
        public int $expectedRevision,
        #[Filled, RequiredWithout('weight')]
        public string|null $text,
        #[Between(Memory::LIGHTEST, Memory::HEAVIEST)]
        public int|null $weight,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Memory::class;
    }
}
