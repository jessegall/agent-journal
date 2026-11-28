<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RecordDriverImageAnswer;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\CommandHandler;
use App\Bus\JournalCommands;
use App\Hosts\Commands\AllowHostImages\AllowHostImagesCommand;
use App\Hosts\Contracts\HostDriverImages;
use App\Hosts\DriverImageChecks;
use App\Hosts\DriverImageJudgement;
use App\Hosts\Enums\DriverImagePhase;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\Payloads\HostContainerRunResultPayload;
use App\Hosts\Protocol\Payloads\HostContainerRunResultsPayload;
use App\Hosts\Protocol\Payloads\HostContainerRunsPayload;
use App\Hosts\Protocol\Payloads\HostImageBuiltPayload;
use App\Hosts\Protocol\Payloads\HostImagesAllowedPayload;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\DriverImageRecipeRecord;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Values\HostInstructionSource;

final readonly class RecordDriverImageAnswerHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'host driver images';

    /**
     * How much of a failed build's output the refusal keeps, from its end.
     */
    private const int OUTPUT_TAIL = 2000;

    public function __construct(
        private DriverImageJudgement $judgement,
        private DriverImageChecks $checks,
        private HostInstructions $instructions,
        private JournalCommands $commands,
        private HostDriverImages $images,
    ) {}

    public function handle(RecordDriverImageAnswerCommand $command): void
    {
        $instruction = HostInstruction::findLocked($command->instructionId);
        $host = Host::findLocked($instruction->host_id);

        $images = HostDriverImage::findWaitingOn($instruction->id);

        // Every waiting image's recipe in one read, as a host holds many images at once.
        $folders = DriverImageRecipeRecord::query()
            ->whereIn('id', array_map(fn (HostDriverImage $image) => $image->driver_image_recipe_id, $images))
            ->pluck('folder', 'id')
            ->all();

        foreach ($images as $image) {
            $folder = (string) $folders[$image->driver_image_recipe_id];

            match ($instruction->type) {
                HostInstructionType::BuildImage => $this->judgeBuild($image, $instruction),
                HostInstructionType::AllowImages => $this->checkAllowed($image, $instruction, $folder),
                HostInstructionType::RunContainers => $this->judgeChecks($image, $instruction, $folder),
                default => null,
            };
        }

        $this->allowWhatIsBuilt($host);
    }

    /**
     * A build that exited 0 with an image and names no credential in its history waits to be allowed; any other is
     * refused with the end of its output.
     */
    private function judgeBuild(HostDriverImage $image, HostInstruction $instruction): void
    {
        if (! $image->isCurrent($instruction->id, DriverImagePhase::Build)) {
            return;
        }

        $built = HostImageBuiltPayload::from($instruction->answerFacts());

        if ($built->exitCode !== 0 || $built->image === '') {
            $image->refuse('the build failed: '.substr($built->stderr, -self::OUTPUT_TAIL));

            return;
        }

        $credential = $this->judgement->credentialIn($built->history);

        if ($credential !== null) {
            $image->refuse("a layer of the built image names a credential: {$credential}");

            return;
        }

        $image->built($built->image);
    }

    /**
     * The runner allowed the set that named the image: an image it still holds goes to its start checks, one the
     * daemon lost is built again.
     */
    private function checkAllowed(HostDriverImage $image, HostInstruction $instruction, string $folder): void
    {
        if (! $image->isCurrent($instruction->id, DriverImagePhase::Allow)) {
            return;
        }

        if (in_array($image->image, HostImagesAllowedPayload::from($instruction->answerFacts())->absent, true)) {
            $image->absent();

            return;
        }

        $image->acknowledged();

        $checks = $this->instructions->runContainers(
            $image->host_id,
            // One round of checks to each allow the image is named in: an allow again after a restart checks again.
            HostInstructionSource::keyed("driver-image-checks:{$image->id}:{$instruction->id}"),
            HostContainerRunsPayload::from(['runs' => $this->checks->of($image->builtImage(), $folder)]),
        );

        $image->markChecksSent($checks->getKey());
    }

    /**
     * Checks that each passed make the image ready; anything else refuses it, so no start ever runs on it.
     */
    private function judgeChecks(HostDriverImage $image, HostInstruction $instruction, string $folder): void
    {
        if (! $image->isCurrent($instruction->id, DriverImagePhase::Check)) {
            return;
        }

        $expected = $this->checks->of($image->builtImage(), $folder);
        $results = HostContainerRunResultsPayload::from($instruction->answerFacts())->results;

        if (! $this->checks->pass($expected, $results)) {
            $printed = array_map(
                fn (HostContainerRunResultPayload $result) => "exit {$result->exitCode}: ".trim($result->stdout.$result->stderr),
                $results,
            );

            $image->refuse(sprintf(
                'a start check of the built image did not run its commands as the executor\'s user (%d checks, %d results: %s)',
                count($expected),
                count($results),
                substr(implode('; ', $printed), 0, self::OUTPUT_TAIL),
            ));

            return;
        }

        $image->checked();

        foreach (HostDriverImage::findReplacedBy($image, $folder) as $replaced) {
            $replaced->retire();
        }
    }

    /**
     * The host is sent the set of the base and every image built and not refused, when it changed.
     */
    private function allowWhatIsBuilt(Host $host): void
    {
        if (! $this->images->needsAllowSet($host)) {
            return;
        }

        $this->commands->runAsJournal(
            CommandEntry::HostControl,
            self::TRUSTED_ENTRY,
            new AllowHostImagesCommand($host->id, $this->images->allowSetOf($host)),
        );
    }
}
