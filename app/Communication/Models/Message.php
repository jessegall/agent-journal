<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Agents\Support\StackTarget;
use App\Communication\Enums\MessageState;
use App\Communication\Enums\MessageWorkState;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\States\Support\AnsweringMessageStateReference;
use App\Communication\Support\MessageWork;
use App\Hooks\Contracts\WorkedOnStack;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Models\Support\BelongsToOneAgent;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One message. When it needs an agent's answer, the agent and session that owe it are set by asking for the answer.
 * Only the agent it is addressed to reads it; a message not yet addressed belongs to no agent.
 *
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $body
 * @property MessageState $state
 * @property string|null $agent_id
 * @property string|null $session_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['body'])]
final class Message extends Model implements Numbered, ReadableModel, WorkedOnStack
{
    use BelongsToOneAgent, HasNumber, HasUlids;
    use BoundedReads;
    use Linkable;

    public const string LINK_TYPE = 'communication.message';

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['state' => 'sent'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => MessageState::class,
        ];
    }

    /**
     * The message read under its row lock, among those the actor may see, for a change that must happen once.
     */
    public static function lockedById(string $id): self
    {
        // A message belongs to no agent until one is asked to answer it.
        return self::lockedForActorOrUnheld($id) ?? throw MessageMissing::forId($id);
    }

    /**
     * The message's first line, the only text a link card shows of it.
     */
    public function firstLine(): string
    {
        return mb_strimwidth(strtok($this->body, "\n") ?: '', 0, 80, '…');
    }

    public function requireAnswerFrom(StackTarget $target): void
    {
        $this->state = MessageState::WaitingForAnswer;
        $this->agent_id = $target->agentId;
        $this->session_id = $target->sessionId;
        $this->save();
    }

    /**
     * The state a frame holds while the question is answered.
     */
    public function workState(): StateReference
    {
        return AnsweringMessageStateReference::forMessage($this);
    }

    public function markAnswered(): void
    {
        $this->state = MessageState::Answered;
        $this->save();
    }

    public function dismiss(): void
    {
        $this->state = MessageState::Dismissed;
        $this->save();
    }

    public function work(): MessageWork
    {
        return new MessageWork($this->number, MessageWorkState::of($this->state));
    }
}
