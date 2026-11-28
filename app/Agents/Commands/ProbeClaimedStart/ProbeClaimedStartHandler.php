<?php

declare(strict_types=1);

namespace App\Agents\Commands\ProbeClaimedStart;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Drivers\Processes\AgentImageProbes;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Hosts\Contracts\HostDriverImages;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\DriverImageRecipeRecord;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Models\Projects\HostDriverImageWait;
use App\Models\Sessions\SessionProcess;
use App\Sessions\StartHeartbeats;
use App\Values\HostInstructionSource;
use App\Values\HostProcessPlan;

final readonly class ProbeClaimedStartHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'headless starts';

    public function __construct(
        private DriverProfiles $profiles,
        private HostDriverImages $images,
        private AgentImageProbes $probes,
        private StartHeartbeats $heartbeats,
        private JournalCommands $commands,
    ) {}

    public function handle(ProbeClaimedStartCommand $command): void
    {
        $start = SessionProcess::findLockedById($command->startId);

        // A cancelled start wins over its image, and a start already probed is not probed twice.
        $isProbed = HostProcess::hasBuildProbeOf($start->id);

        if (! $start->isStarting() || $isProbed) {
            return;
        }

        $runtime = AgentRuntime::findForSession($start->session_id);

        if ($runtime === null) {
            return;
        }

        $driver = $this->profiles->of($runtime);
        $place = $runtime->executablePlace();
        $probe = $driver->versionProbe($runtime->canonical_folder, $place);

        if ($place === ExecutablePlace::Image) {
            $probe = $this->inDriverImage($probe, $start, $runtime->session()->sole(), $driver);
        }

        if ($probe === null) {
            return;
        }

        $source = HostInstructionSource::fromJournal();
        $open = new OpenHostProcessCommand($runtime->host_id, $runtime->id, $probe, $source, $start->id);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $open);
    }

    /**
     * The probe in the start's driver image once the image is ready, frozen on the session; none while it waits, or
     * when the image was refused and the start with it.
     */
    private function inDriverImage(
        HostProcessPlan $probe,
        SessionProcess $start,
        AgentSession $session,
        DriverProfile $driver,
    ): HostProcessPlan|null {
        $host = Host::findLocked((string) $start->host_id);
        $wait = HostDriverImageWait::findOfStart($start->id);
        $image = $this->imageOf($wait, $host, $session, $driver);

        if ($image->isRefused()) {
            $wait?->consume();
            $this->heartbeats->refuseStart($start, "its driver image was refused: {$image->refusal}");

            return null;
        }

        if (! $image->isReady()) {
            if ($wait === null) {
                $this->images->awaitFor($image, $start);
            }

            return null;
        }

        $recipe = DriverImageRecipeRecord::query()->findOrFail($image->driver_image_recipe_id);
        $session->freezeDriverImage($image, $recipe);
        $wait?->consume();

        return $this->probes->inDriverImage($probe, $image->builtImage());
    }

    /**
     * The image row the start runs on, locked: the one it waits on, else the one of the recipe its session froze, else
     * the driver's current one, so a deploy between a wait and its wake leaves the start on what it waited for.
     */
    private function imageOf(
        HostDriverImageWait|null $wait,
        Host $host,
        AgentSession $session,
        DriverProfile $driver,
    ): HostDriverImage {
        if ($wait !== null) {
            return HostDriverImage::findLocked($wait->host_driver_image_id);
        }

        if ($session->driver_recipe_digest !== null) {
            $frozen = DriverImageRecipeRecord::findForDigest($session->driver_recipe_digest);

            return HostDriverImage::create($host, $frozen);
        }

        return $this->images->imageFor($host, $driver);
    }
}
