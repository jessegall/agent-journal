<?php

declare(strict_types=1);

namespace Domain\Memory\Commands\EditMemory;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
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
#[Authorize(MemoryPolicy::class, AccessType::Edit)]
final readonly class EditMemoryCommand extends Command
{
    public function __construct(
        public string $memoryId,
        public int $expectedRevision,
        #[Filled, RequiredWithout('weight')]
        public string|null $text,
        #[Between(Memory::LIGHTEST, Memory::HEAVIEST)]
        public int|null $weight,
    ) {}
}
