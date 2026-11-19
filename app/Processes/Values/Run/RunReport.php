<?php

declare(strict_types=1);

namespace App\Processes\Values\Run;

use App\Processes\Enums\ReportLineType;

/**
 * What the run command prints and the exit status it ends with.
 */
final readonly class RunReport
{
    /**
     * @param  list<ReportLine>  $lines
     */
    private function __construct(public array $lines, public int $status) {}

    public static function ending(int $status): self
    {
        return new self([], $status);
    }

    public function line(string $text): self
    {
        return $this->with(ReportLineType::Line, $text);
    }

    public function error(string $text): self
    {
        return $this->with(ReportLineType::Error, $text);
    }

    public function output(string $text): self
    {
        return $this->with(ReportLineType::Output, $text);
    }

    private function with(ReportLineType $type, string $text): self
    {
        return new self([...$this->lines, new ReportLine($type, $text)], $this->status);
    }
}
