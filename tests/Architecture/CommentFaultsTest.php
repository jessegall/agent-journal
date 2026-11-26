<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;

/**
 * The comments check (tools/refactoring/comment-faults.php) refuses a comment that tells history, narrates the
 * code's steps, holds a forbidden word or runs past three lines, and keeps one that only looks alike.
 */
final class CommentFaultsTest extends TestCase
{
    public function test_each_rule_refuses_its_sample_and_the_near_misses_pass(): void
    {
        $check = new Process(['php', 'tools/refactoring/comment-faults.php', 'tests/Fixtures/Comments'], base_path());
        $check->run();
        $kinds = [];

        foreach (explode("\n", trim($check->getOutput())) as $line) {
            if (preg_match('/:(\d+)  (\w+)/', $line, $match) === 1) {
                $kinds[(int) $match[1]] = $match[2];
            }
        }

        $this->assertSame([12 => 'history', 17 => 'narration', 22 => 'poetry', 27 => 'long'], $kinds);
    }
}
