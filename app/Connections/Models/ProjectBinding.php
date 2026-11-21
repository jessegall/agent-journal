<?php

declare(strict_types=1);

namespace App\Connections\Models;

use App\Agents\Models\Agent;
use App\Agents\Models\Host;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Events\ProjectBindingCreated;
use App\Connections\Events\ProjectBindingRevoked;
use App\Connections\Exceptions\BindingUnrecoverable;
use App\Connections\Values\BindingFolder;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One project folder on one machine, joined to a project through that machine's host, with the main agent that works
 * in it. The relay names the folder by an opaque root id; its canonical path never reaches a label or a log. Every
 * credential it holds belongs to one authority generation, which a revocation raises.
 *
 * @property string $id
 * @property string $host_id
 * @property string $project_id
 * @property string $main_agent_id
 * @property string $root_id
 * @property string $canonical_root
 * @property string $project_label
 * @property string $machine_label
 * @property string $installation_nonce
 * @property int $authority_generation
 * @property BindingReadiness $readiness
 * @property CarbonImmutable|null $last_contact_at
 * @property CarbonImmutable|null $presence_expires_at
 * @property string|null $boot_id
 * @property int $report_sequence
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Agent $mainAgent
 * @property-read Host $host
 */
#[Fillable([
    'host_id', 'project_id', 'main_agent_id', 'root_id', 'canonical_root', 'project_label', 'machine_label',
    'installation_nonce',
])]
final class ProjectBinding extends Model implements EventSource, ReadableModel
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
            'authority_generation' => 'integer',
            'readiness' => BindingReadiness::class,
            'last_contact_at' => 'immutable_datetime',
            'presence_expires_at' => 'immutable_datetime',
            'report_sequence' => 'integer',
        ];
    }

    /**
     * Joins the folder to the project through the host, pending until its relay first reports, in authority
     * generation 1.
     */
    public static function create(Host $host, Project $project, Agent $mainAgent, BindingFolder $folder): self
    {
        $binding = new self();
        $binding->host_id = $host->id;
        $binding->project_id = $project->id;
        $binding->main_agent_id = $mainAgent->id;
        $binding->root_id = $folder->rootId;
        $binding->canonical_root = $folder->canonicalRoot;
        $binding->project_label = $project->label;
        $binding->machine_label = $folder->machineLabel;
        $binding->installation_nonce = $folder->installationNonce;
        $binding->authority_generation = 1;
        $binding->readiness = BindingReadiness::Pending;
        $binding->report_sequence = 0;
        $binding->assertSaved($binding->save());
        $binding->raise(new ProjectBindingCreated($binding->id, $project->id, $host->id, CarbonImmutable::now()));

        return $binding;
    }

    // ----------[ Queries ]----------

    /**
     * The binding this host's redemption made under its installation nonce.
     *
     * @throws BindingUnrecoverable
     */
    public static function ofHostByNonce(string $hostId, string $installationNonce): self
    {
        return self::query()->where('host_id', $hostId)->where('installation_nonce', $installationNonce)
            ->firstOr(fn () => throw BindingUnrecoverable::generic());
    }

    /**
     * Every connected folder, newest first; an installation connects a handful.
     *
     * @return list<self>
     */
    public static function listed(): array
    {
        return array_values(
            self::query()->latest()->readAll('an installation connects a handful of folders')->get()->all(),
        );
    }

    /**
     * The binding of this id, locked until the transaction ends.
     */
    public static function lockById(string $id): self
    {
        return self::query()->with('host')->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Mutations ]----------

    /**
     * Ends the binding's authority: the generation rises, so every credential issued under the one before is refused.
     */
    public function revoke(): void
    {
        $this->authority_generation++;
        $this->readiness = BindingReadiness::Revoked;
        $this->assertSaved($this->save());
        $this->raise(new ProjectBindingRevoked($this->id, $this->authority_generation, CarbonImmutable::now()));
    }

    // ----------[ Answers ]----------

    /**
     * Where the binding stands at this server time: a ready binding whose presence expired is offline.
     */
    public function readinessAt(CarbonImmutable $serverTime): BindingReadiness
    {
        if ($this->readiness !== BindingReadiness::Ready) {
            return $this->readiness;
        }

        if ($this->presence_expires_at === null || ! $serverTime->lessThan($this->presence_expires_at)) {
            return BindingReadiness::Offline;
        }

        return BindingReadiness::Ready;
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Host, $this>
     */
    public function host(): BelongsTo
    {
        return $this->belongsTo(Host::class);
    }

    /**
     * @return BelongsTo<Agent, $this>
     */
    public function mainAgent(): BelongsTo
    {
        return $this->belongsTo(Agent::class, 'main_agent_id');
    }
}
