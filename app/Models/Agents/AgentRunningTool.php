<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Hooks\RunningToolChanged;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Values\ToolLine;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use PhpOption\Option;

/**
 * The tool call an agent's activity line names: the newest one its hooks let run, whether it still runs, and when that
 * last changed. One row per agent, which a new turn clears.
 *
 * @property string $id
 * @property string $agent_id
 * @property string|null $line
 * @property bool $is_running
 * @property CarbonImmutable $changed_at
 * @property-read non-falsy-string $changed_at_text
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class AgentRunningTool extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
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

    // ----------[ Constructors ]----------

    public static function create(string $agentId, ToolLine $line): self
    {
        $tool = new self();
        $tool->agent_id = $agentId;
        $tool->start($line);

        return $tool;
    }

    // ----------[ Mutations ]----------

    /**
     * The agent's hooks let a tool call run: its line is the one shown, running from now.
     */
    public function start(ToolLine $line): void
    {
        $this->change($line->text, true);
    }

    /**
     * The agent's running call finished: its line stays, no longer running. With no line held nothing changes.
     */
    public function finish(): void
    {
        if (! $this->exists || $this->line === null || ! $this->is_running) {
            return;
        }

        $this->change($this->line, false);
    }

    /**
     * A new turn of the agent began: no line is shown. A row already clear changes nothing.
     */
    public function clear(): void
    {
        if (! $this->exists || $this->line === null) {
            return;
        }

        $this->change(null, false);
    }

    private function change(string|null $line, bool $isRunning): void
    {
        $this->line = $line;
        $this->is_running = $isRunning;
        $this->changed_at = CarbonImmutable::now();
        $this->saveAndAssert();
        $this->raise(new RunningToolChanged($this->agent_id, $line, $isRunning, $this->changed_at_text));
    }

    // ----------[ Accessors ]----------

    /**
     * When the line last changed, in UTC with microseconds, as the browser orders the changes it receives.
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function changedAtText(): Attribute
    {
        return Accessor::get(fn (): string => $this->changed_at->setTimezone('UTC')->format(self::CHANGED_AT_FORMAT));
    }

    // ----------[ Queries ]----------

    /**
     * The agent's running-tool row; none before its first tool call.
     *
     * @return Option<self>
     */
    public static function findShownOf(string $agentId): Option
    {
        $tool = self::query()->ofAgent($agentId)->first();

        return Option::fromValue($tool);
    }

    /**
     * The agent's row, locked, if a tool call has been recorded.
     */
    public static function findLockedFor(string $agentId): self|null
    {
        return self::query()->ofAgent($agentId)->lockForUpdate()->first();
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
