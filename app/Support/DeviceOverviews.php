<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\EnvironmentTasks;
use App\Exceptions\VerbNotServed;
use App\Models\Environment;
use App\Models\ProjectBinding;
use App\Values\DeviceCaller;
use App\Values\DeviceOverview;

/**
 * The overview of a terminal sign-in: its binding's project and environment, and the approving user's tasks of that
 * environment, with no agent stack or session. A binding with no environment answers nothing.
 */
final readonly class DeviceOverviews
{
    /**
     * The most tasks an overview names.
     */
    public const int TASK_LIMIT = 20;

    public function __construct(private EnvironmentTasks $tasks) {}

    /**
     * @throws VerbNotServed
     */
    public function of(DeviceCaller $caller): DeviceOverview
    {
        $binding = ProjectBinding::query()->whereKey($caller->bindingId)->firstOrFail();

        if ($binding->isEnvironmentUnassigned()) {
            throw VerbNotServed::environmentUnassigned($binding->id);
        }

        $environment = Environment::ofProjectById($binding->project_id, (string) $binding->environment_id);

        return new DeviceOverview(
            $binding->project_label,
            $environment->label,
            $this->tasks->assignedToActor($environment->id, self::TASK_LIMIT),
        );
    }
}
