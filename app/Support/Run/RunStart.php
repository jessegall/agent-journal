<?php

declare(strict_types=1);

namespace App\Support\Run;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\RunLinePipeline;
use App\Pipelines\RunNamedAdmissionPipeline;
use App\Pipelines\RunPermitPipeline;
use App\Support\CallKey;

/**
 * What the run command was asked: a line to admit, a permit to run, or an admission to start, with the request key
 * that use goes under, the folder it was called in and the environment a child inherits.
 */
final readonly class RunStart
{
    /**
     * @param  array<string, string>  $environment
     */
    public function __construct(
        public string|null $line,
        public string $dialect,
        public string|null $permit,
        public string $admissionId,
        public CallKey $requestKey,
        public string $workingFolder,
        public array $environment,
    ) {}

    /**
     * The pipeline the request starts with: admitting a line, running a permit, or starting a named admission.
     *
     * @return class-string<PipelineDefinition<object, object>>
     */
    public function entryPipeline(): string
    {
        return match (true) {
            $this->line !== null => RunLinePipeline::class,
            $this->permit !== null => RunPermitPipeline::class,
            default => RunNamedAdmissionPipeline::class,
        };
    }

    public function admission(string $admissionId): PendingAdmission
    {
        return new PendingAdmission($admissionId, $this->requestKey, $this->environment);
    }
}
