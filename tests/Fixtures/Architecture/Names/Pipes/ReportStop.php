<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\Names\Pipes;

/**
 * An action whose verb has a better word: it notifies.
 */
final class ReportStop
{
    public function close(): void {}

    public function closes(): void {}

    public function name(): void {}

    public function run(): void {}

    public function spawn(): void {}
}
