<?php

declare(strict_types=1);

namespace Domain\Tasks\Calls;

use App\Attributes\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Domain\Tasks\Models\Task;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Files a new open task.
 *
 * @implements JournalCall<TaskNamed>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('tasks/create', 'POST', TaskNamed::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class CreateTaskCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(Task::TITLE_CHARACTER_LIMIT)]
        public string $title,
        #[Max(Task::NOTE_CHARACTER_LIMIT)]
        public string $brief,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
    ) {}
}
