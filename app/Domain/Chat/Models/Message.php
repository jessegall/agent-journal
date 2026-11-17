<?php

declare(strict_types=1);

namespace App\Domain\Chat\Models;

use App\Core\Hooks\Models\OwnedByOneAgent;
use App\Core\Hooks\StackTarget;
use App\Core\Links\Linkable;
use App\Domain\Chat\MessageState;
use App\Domain\Chat\MessageWork;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One message. When it needs an agent's answer, the agent and session that owe it are set by asking for the answer.
 * Only the agent it is addressed to reads it; a message not yet addressed belongs to no agent.
 *
 * @property int $id
 * @property string $body
 * @property MessageState $state
 * @property int|null $agent_id
 * @property int|null $session_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['body'])]
final class Message extends Model
{
    use Linkable;
    use OwnedByOneAgent;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['state' => 'sent'];

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
        return new MessageWork($this->id, $this->state->workState());
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => MessageState::class,
            'agent_id' => 'integer',
            'session_id' => 'integer',
        ];
    }
}
