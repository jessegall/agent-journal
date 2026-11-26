<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Work;

use App\Agents\Drivers\Setup\DriverProfiles;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Hosts\HostProcessPurpose;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Values\DriverRegistration;
use Illuminate\Database\Eloquent\Builder;

/**
 * Which runtimes a process takes the work of: a runtime's own process its runtime alone, an account's owner every
 * headless runtime on its host whose current start runs on the owner's account and sign-in generation.
 */
final readonly class AccountOwners
{
    public function __construct(private DriverCatalogue $drivers, private DriverProfiles $profiles) {}

    /**
     * Whether an account's owner runs the runtime's turns, as its driver's setup says.
     */
    public function serves(AgentRuntime $runtime): bool
    {
        return in_array($runtime->driver_key, $this->servedKeys(), true);
    }

    /**
     * The runtimes the process takes requests for.
     *
     * @return Builder<AgentRuntime>
     */
    public function runtimesOf(HostProcess $process): Builder
    {
        if ($process->purpose !== HostProcessPurpose::AccountOwner) {
            return AgentRuntime::query()->whereKey($process->agent_runtime_id);
        }

        $owned = $process->sessionProcess()->sole();

        $sessions = SessionProcess::query()
            ->supervised()
            ->unresolved()
            ->onAccountGenerationOf($owned)
            ->select('session_id');

        return AgentRuntime::query()
            ->onHost($process->host_id)
            ->whereIn('driver_key', $this->servedKeys())
            ->ofSessions($sessions);
    }

    /**
     * The keys of the headless drivers whose setup runs an account's turns on one owner.
     *
     * @return list<string>
     */
    private function servedKeys(): array
    {
        $served = array_filter(
            $this->drivers->catalogue(),
            fn (DriverRegistration $registration) => ! $registration->opensTerminal()
                && $this->profiles->ofFamily($registration->family)->hasAccountOwner(),
        );

        return array_values(array_map(fn (DriverRegistration $registration) => $registration->key->key, $served));
    }
}
