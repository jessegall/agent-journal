<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\ApproveRuleBundle;
use App\Processes\Events\BundleActivated;
use App\Processes\Exceptions\ApprovalRefused;
use App\Processes\Models\ModuleRuleBundle;
use App\Processes\Support\CommandRuleRegistry;
use App\Processes\Support\ProjectKey;
use App\Processes\Values\RuleBundle;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Records the owner's activation of a module bundle that is installed now with the digest they reviewed; a bundle that
 * changed since, or is no longer installed, is refused.
 */
final readonly class ApproveRuleBundleHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private CommandRuleRegistry $rules,
        private ProjectKey $projects,
        private Dispatcher $events,
    ) {}

    /**
     * @throws ApprovalRefused
     */
    public function handle(ApproveRuleBundle $command): string
    {
        $installed = array_values(array_filter(
            $this->rules->bundles(),
            fn (RuleBundle $bundle): bool => $bundle->module === $command->module
                && $bundle->version === $command->version
                && $bundle->digest() === $command->digest,
        ));
        if ($installed === []) {
            throw ApprovalRefused::bundleChanged($command->module);
        }

        $owner = ActorIdentity::of($this->actors->actor());
        $approval = ModuleRuleBundle::approve($this->projects->current(), $installed[0], $owner);
        $this->events->dispatch(BundleActivated::forApproval($approval));

        return $approval->id;
    }
}
