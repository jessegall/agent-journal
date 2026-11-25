<?php

declare(strict_types=1);

namespace App\Models\CommandRules;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Support\ActorReference;
use App\Values\RuleBundle;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $project_key
 * @property string $module
 * @property string $version
 * @property string $digest
 * @property string $approver_type
 * @property string $approver_id
 * @property CarbonImmutable $approved_at
 *
 * @mixin \Eloquent
 */
final class ModuleRuleBundle extends Model implements ReadableModel
{
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

    public static function create(string $projectKey, RuleBundle $bundle, ActorReference $approver): self
    {
        $approval = new self();
        $approval->project_key = $projectKey;
        $approval->module = $bundle->module;
        $approval->version = $bundle->version;
        $approval->digest = $bundle->digest();
        $approval->approver_type = $approver->type;
        $approval->approver_id = $approver->id;
        $approval->setAttribute($approval->getKeyName(), $approval->newUniqueId());
        $approval->insertIfAbsent();

        return self::findOfBundle($projectKey, $bundle);
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
    public static function findOfBundle(string $projectKey, RuleBundle $bundle): self
    {
        return self::query()->ofBundle($projectKey, $bundle)->sole();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey);
    }

    /**
     * The project's approval of exactly this bundle: its module, version and digest.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofBundle(Builder $query, string $projectKey, RuleBundle $bundle): void
    {
        $query->ofProject($projectKey)
            ->where('module', $bundle->module)
            ->where('version', $bundle->version)
            ->where('digest', $bundle->digest());
    }
}
