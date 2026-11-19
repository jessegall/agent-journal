<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * The failure text every boundary test prints: one line per violation, then the question to answer.
 */
final class BoundaryReport
{
    /**
     * @param  list<Violation>  $violations
     */
    public static function of(array $violations, string $projectRoot): string
    {
        $count = count($violations);
        $lines = implode("\n", array_map(
            fn (Violation $violation) => '  '.self::relative(
                $violation->file,
                $projectRoot,
            ).":{$violation->line} {$violation->reason()}",
            $violations,
        ));

        return <<<REPORT
        Domain boundary violations ({$count}):
        {$lines}
        Is the dependency right (add it to the Domain class, with the user's yes), or is the code in the wrong domain?
        REPORT;
    }

    private static function relative(string $path, string $projectRoot): string
    {
        if (! str_starts_with($path, $projectRoot.'/')) {
            return $path;
        }

        return substr($path, strlen($projectRoot) + 1);
    }
}
