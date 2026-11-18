<?php

declare(strict_types=1);

namespace Domain\Chat\Models;

use App\Agents\Support\StackTarget;
use App\Hooks\Models\Support\BelongsToOneAgent;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use Domain\Chat\Enums\MessageState;
use Domain\Chat\Enums\MessageWorkState;
use Domain\Chat\Exceptions\MessageMissing;
use Domain\Chat\Support\MessageWork;
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
final class Message extends Model implements Numbered
{
    use BelongsToOneAgent, HasNumber, HasUlids;
    use Linkable;

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

    public function requireAnswerFrom(StackTarget $target): void
    {
        $this->state = MessageState::WaitingForAnswer;
        $this->agent_id = $target->agentId;
        $this->session_id = $target->sessionId;
        $this->save();
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
