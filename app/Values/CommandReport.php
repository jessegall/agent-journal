<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ReportLineType;
use Illuminate\Console\Command;

/**
 * What a console command prints and the exit status it ends with.
 */
final readonly class CommandReport
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

    /**
     * Prints every line to the command, each as its type says.
     */
    public function printTo(Command $command): void
    {
        foreach ($this->lines as $line) {
            match ($line->type) {
                ReportLineType::Line => $command->line($line->text),
                ReportLineType::Error => $command->error($line->text),
                ReportLineType::Output => $command->getOutput()->write($line->text),
            };
        }
    }

    private function with(ReportLineType $type, string $text): self
    {
        return new self([
            ...$this->lines,
            new ReportLine($type, $text),
        ], $this->status);
    }
}
