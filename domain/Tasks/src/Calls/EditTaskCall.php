<?php

declare(strict_types=1);

namespace Domain\Tasks\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Domain\Tasks\Models\Task;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Changes a task's title or brief, as the revision its caller read.
 *
 * @implements JournalCall<TaskEdited>
 */
#[Endpoint('tasks/edit', 'POST', TaskEdited::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
#[MapName(SnakeCaseMapper::class)]
final class EditTaskCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid]
        public string $taskId,
        #[Min(1)]
        public int $expectedRevision,
        #[Max(Task::TITLE_CHARACTERS), RequiredWithout('brief')]
        public string|null $title,
        #[Max(Task::NOTE_CHARACTERS), RequiredWithout('title')]
        public string|null $brief,
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
    ) {}
}
