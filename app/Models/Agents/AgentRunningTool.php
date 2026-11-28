<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Hooks\RunningToolChanged;
use App\Models\Support\JournalModel;
use App\Values\ToolLine;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use PhpOption\Option;

/**
 * The tool call an agent's chat line names: the newest one its hooks let run, whether it still runs, and when that
 * last changed. One row per agent, which a new turn clears.
 *
 * @property string $id
 * @property string $agent_id
 * @property string|null $line
 * @property bool $is_running
 * @property CarbonImmutable $changed_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class AgentRunningTool extends JournalModel implements EventSource
{
    use BoundedReads;
    use RaisesEvents;

    public const string CHANGED_AT_FORMAT = 'Y-m-d\TH:i:s.u\Z';

    protected $table = 'agent_running_tools';

    // Microseconds are kept, so two changes within one second still order.
    protected $dateFormat = 'Y-m-d H:i:s.u';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_running' => 'boolean',
            'changed_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * The agent's hooks let a tool call run: its line is the one shown, running from now.
     */
    public static function startFor(string $agentId, ToolLine $line): void
    {
        self::lockedOf($agentId)->change($line->text, true);
    }

    /**
     * The agent's running call finished: its line stays, no longer running. With no line held nothing changes.
     */
    public static function finishFor(string $agentId): void
    {
        $tool = self::lockedOf($agentId);

        if (! $tool->exists || $tool->line === null || ! $tool->is_running) {
            return;
        }

        $tool->change($tool->line, false);
    }

    /**
     * A new turn of the agent began: no line is shown. A row already clear changes nothing.
     */
    public static function clearFor(string $agentId): void
    {
        $tool = self::lockedOf($agentId);

        if (! $tool->exists || $tool->line === null) {
            return;
        }

        $tool->change(null, false);
    }

    private function change(string|null $line, bool $isRunning): void
    {
        $this->line = $line;
        $this->is_running = $isRunning;
        $this->changed_at = CarbonImmutable::now();
        $this->saveAndAssert();
        $this->raise(new RunningToolChanged($this->agent_id, $line, $isRunning, $this->changedAtText()));
    }

    // ----------[ Calculations ]----------

    /**
     * When the line last changed, in UTC with microseconds, as the browser orders the changes it receives.
     */
    public function changedAtText(): string
    {
        return $this->changed_at->setTimezone('UTC')->format(self::CHANGED_AT_FORMAT);
    }

    // ----------[ Queries ]----------

    /**
     * The agent's running-tool row; none before its first tool call.
     *
     * @return Option<self>
     */
    public static function shownOf(string $agentId): Option
    {
        return Option::fromValue(self::query()->ofAgent($agentId)->first());
    }

    /**
     * The agent's row, locked; a new, unsaved one before its first tool call.
     */
    private static function lockedOf(string $agentId): self
    {
        $tool = self::query()->ofAgent($agentId)->lockForUpdate()->first();

        if ($tool instanceof self) {
            return $tool;
        }

        $tool = new self();
        $tool->agent_id = $agentId;

        return $tool;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgent(Builder $query, string $agentId): void
    {
        $query->where('agent_id', $agentId);
    }
}
