<?php

declare(strict_types=1);

namespace App\Processes\Values\Run;

use App\AgentRequests\Values\CommandReport;

/**
 * The journal's answer to a line to admit: the run it admitted, or why it refused and what to do instead.
 */
final readonly class LineAdmission
{
    /**
     * @param  array<string, string>  $environment
     */
    private function __construct(
        public bool $allowed,
        public string $runId,
        public string $refusal,
        public string $correction,
        public string $requestId,
        public string $next,
        public array $environment,
    ) {}

    /**
     * @param  array<string, mixed>  $answer
     * @param  array<string, string>  $environment
     */
    public static function fromAnswer(array $answer, array $environment): self
    {
        if ($answer['allowed'] === true) {
            return new self(true, (string) $answer['run_id'], '', '', '', '', $environment);
        }

        return new self(
            false,
            '',
            "{$answer['code']}: {$answer['reason']} {$answer['notice']}",
            (string) $answer['correction'],
            (string) $answer['request_id'],
            (string) $answer['next'],
            $environment,
        );
    }

    public function isAllowed(): bool
    {
        return $this->allowed;
    }

    public function admission(): AdmissionToRun
    {
        return new AdmissionToRun($this->runId, $this->environment);
    }

    public function refusalReport(): CommandReport
    {
        $report = CommandReport::ending(1)->error($this->refusal)->line("Correction: {$this->correction}");

        return $this->requestId === '' ? $report : $report->line("Request {$this->requestId}. Next: {$this->next}");
    }
}
