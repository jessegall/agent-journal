<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Projects\ProjectOwned;
use App\Contracts\Records\ReadableModel;
use App\Models\Projects\Project;
use App\Models\Support\BelongsToProject;
use App\Support\ActorReference;
use App\Values\RuleBundle;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $project_id
 * @property string $module
 * @property string $version
 * @property string $digest
 * @property string $approver_type
 * @property string $approver_id
 * @property CarbonImmutable $approved_at
 *
 * @mixin \Eloquent
 */
final class ModuleRuleBundle extends Model implements ProjectOwned, ReadableModel
{
    use BelongsToProject;
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    public const string CREATED_AT = 'approved_at';

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['approved_at' => 'datetime'];
    }

    // ----------[ Constructors ]----------

    public static function create(Project $project, RuleBundle $bundle, ActorReference $approver): self
    {
        $approval = new self();
        $approval->project_id = $project->id;
        $approval->module = $bundle->module;
        $approval->version = $bundle->version;
        $approval->digest = $bundle->digest();
        $approval->approver_type = $approver->type;
        $approval->approver_id = $approver->id;
        $approval->setAttribute($approval->getKeyName(), $approval->newUniqueId());
        $approval->insertIfAbsent();

        return self::findOfBundle($project, $bundle);
    }

    // ----------[ Predicates ]----------

    public function approves(RuleBundle $bundle): bool
    {
        return $this->module === $bundle->module
            && $this->version === $bundle->version
            && $this->digest === $bundle->digest();
    }

    // ----------[ Queries ]----------

    /**
     * The project's approval of this bundle.
     */
    public static function findOfBundle(Project $project, RuleBundle $bundle): self
    {
        return self::query()->inProject($project->id)->ofBundle($bundle)->sole();
    }

    // ----------[ Scopes ]----------

    /**
     * The approval of exactly this bundle: its module, version and digest.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofBundle(Builder $query, RuleBundle $bundle): void
    {
        $query->where('module', $bundle->module)
            ->where('version', $bundle->version)
            ->where('digest', $bundle->digest());
    }
}
