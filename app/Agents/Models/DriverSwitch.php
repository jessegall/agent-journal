<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Enums\DriverSwitchStage;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Events\DriverSwitchStopped;
use App\Agents\Exceptions\DriverSwitchStageRefused;
use App\Agents\Values\ChosenAccount;
use App\Agents\Values\DriverSwitchTarget;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Drivers\Enums\HookDriver;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One switch of an agent from its running driver session to another: the request, the session and process
 * generation it expects to replace, its target and the stage it stands at. An agent has one open switch at most.
 *
 * @property string $id
 * @property string $request_id
 * @property string $agent_id
 * @property string $expected_session_id
 * @property int $expected_generation
 * @property HookDriver $driver
 * @property DriverVariant $variant
 * @property string $account_id
 * @property int $account_revision
 * @property string|null $conversation_id
 * @property bool $save_variant
 * @property string $requested_by
 * @property string|null $replacement_session_id
 * @property DriverSwitchStage $stage
 * @property string|null $failure_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'request_id',
    'agent_id',
    'expected_session_id',
    'expected_generation',
    'driver',
    'variant',
    'account_id',
    'account_revision',
    'conversation_id',
    'save_variant',
    'requested_by',
    'replacement_session_id',
    'stage',
    'failure_reason',
])]
final class DriverSwitch extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'driver' => HookDriver::class,
            'variant' => DriverVariant::class,
            'expected_generation' => 'integer',
            'account_revision' => 'integer',
            'save_variant' => 'boolean',
            'stage' => DriverSwitchStage::class,
        ];
    }

    /**
     * A requested switch of the agent away from the session and process generation it runs now.
     */
    public static function create(
        string $requestId,
        AgentSession $session,
        int $generation,
        DriverSwitchTarget $target,
        string $requestedBy,
    ): self {
        $switch = new self();
        $switch->request_id = $requestId;
        $switch->agent_id = $session->agent_id;
        $switch->expected_session_id = $session->id;
        $switch->expected_generation = $generation;
        $switch->driver = $target->driver;
        $switch->variant = $target->variant;
        $switch->account_id = $target->account->accountId;
        $switch->account_revision = $target->account->reviewedSignIn;
        $switch->conversation_id = $target->conversationId;
        $switch->save_variant = $target->saveVariant;
        $switch->requested_by = $requestedBy;
        $switch->stage = DriverSwitchStage::Requested;
        $switch->save();

        return $switch;
    }

    // ----------[ Queries ]----------

    public static function ofRequest(string $requestId): self|null
    {
        return self::query()->where('request_id', $requestId)->lockForUpdate()->first();
    }

    /**
     * The open switch waiting for the stop of this session, locked.
     */
    public static function stoppingOf(string $sessionId): self|null
    {
        return self::query()
            ->where('expected_session_id', $sessionId)
            ->whereIn('stage', [DriverSwitchStage::Stopping->value, DriverSwitchStage::StopUnconfirmed->value])
            ->lockForUpdate()
            ->first();
    }

    /**
     * The open switch waiting for this replacement session to run, locked.
     */
    public static function startingOf(string $sessionId): self|null
    {
        return self::query()
            ->where('replacement_session_id', $sessionId)
            ->whereIn('stage', [DriverSwitchStage::Starting->value, DriverSwitchStage::StartUnconfirmed->value])
            ->lockForUpdate()
            ->first();
    }

    /**
     * The agent's switch that has not ended, locked; the caller holds the agent's lifecycle lock first.
     */
    public static function openOf(string $agentId): self|null
    {
        return self::query()
            ->where('agent_id', $agentId)
            ->whereNotIn('stage', array_map(
                fn (DriverSwitchStage $stage) => $stage->value,
                array_filter(DriverSwitchStage::cases(), fn (DriverSwitchStage $stage) => $stage->isFinal()),
            ))
            ->lockForUpdate()
            ->first();
    }

    // ----------[ Mutations ]----------

    public function markPreflighted(): void
    {
        $this->moveTo(DriverSwitchStage::Preflighted);
    }

    public function refuse(string $reason): void
    {
        $this->moveTo(DriverSwitchStage::Refused, $reason);
    }

    public function beginStopping(): void
    {
        $this->moveTo(DriverSwitchStage::Stopping);
    }

    /**
     * The old session's process is proven gone; the replacement may start, once the commit lands.
     */
    public function markStopped(): void
    {
        $this->moveTo(DriverSwitchStage::Stopped);
        $this->raise(new DriverSwitchStopped($this->id));
    }

    /**
     * The replacement session was admitted and waits for its host to report it running.
     */
    public function beginStarting(string $sessionId): void
    {
        $this->replacement_session_id = $sessionId;
        $this->moveTo(DriverSwitchStage::Starting);
    }

    public function confirm(): void
    {
        $this->moveTo(DriverSwitchStage::Confirmed);
    }

    public function failLaunch(string $reason): void
    {
        $this->moveTo(DriverSwitchStage::LaunchFailed, $reason);
    }

    public function cancel(string|null $reason = null): void
    {
        $this->moveTo(DriverSwitchStage::Cancelled, $reason);
    }

    /**
     * The owner retries a failed launch: the same request and target start again once the commit lands.
     */
    public function retryLaunch(): void
    {
        $this->replacement_session_id = null;
        $this->markStopped();
    }

    /**
     * A recheck of a stop or start that has no answer yet, from the process state the host last reported: without one
     * the switch is marked unconfirmed and waits; a proven stop moves on to the replacement and an old process still
     * running cancels the switch; a replacement that runs is confirmed and one that ended failed.
     */
    public function recheck(ProcessStartState|null $reported): void
    {
        if ($this->stage === DriverSwitchStage::Stopping) {
            $this->moveTo(DriverSwitchStage::StopUnconfirmed);
        }

        if ($this->stage === DriverSwitchStage::Starting) {
            $this->moveTo(DriverSwitchStage::StartUnconfirmed);
        }

        $waitsForStop = $this->stage === DriverSwitchStage::StopUnconfirmed;
        $waitsForStart = $this->stage === DriverSwitchStage::StartUnconfirmed;

        match (true) {
            $waitsForStop && $reported === ProcessStartState::Stopped => $this->markStopped(),
            $waitsForStop && $reported === ProcessStartState::Running => $this->cancel('the old session still runs'),
            $waitsForStart && $reported === ProcessStartState::Running => $this->confirm(),
            $waitsForStart && $reported === ProcessStartState::Stopped => $this->failLaunch('the new session ended'),
            default => null,
        };
    }

    // ----------[ Answers ]----------

    public function target(): DriverSwitchTarget
    {
        return new DriverSwitchTarget(
            $this->driver,
            $this->variant,
            new ChosenAccount($this->account_id, $this->account_revision),
            $this->conversation_id,
            $this->save_variant,
        );
    }

    // ----------[ Internals ]----------

    /**
     * @throws DriverSwitchStageRefused
     */
    private function moveTo(DriverSwitchStage $next, string|null $reason = null): void
    {
        if (! $this->stage->mayMoveTo($next)) {
            throw DriverSwitchStageRefused::from($this->stage, $next);
        }

        $this->stage = $next;
        $this->failure_reason = $reason;
        $this->assertSaved($this->save());
    }
}
