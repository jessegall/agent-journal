<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

final class StringNames
{
    /**
     * @return list<string>
     */
    public function names(string $model): array
    {
        $heredoc = <<<NAME
        Tests\Fixtures\Names\Chat\Message
        NAME;

        return [
            'Tests\Fixtures\Names\Chat\Message',
            '\Tests\Fixtures\Names\Chat\Message',
            'Tests\Fixtures\Names\Chat\\'.$model,
            '\Tests\Fixtures\Names\Chat\\'.$model,
            "Tests\\Fixtures\\Names\\Chat\\{$model}",
            "\\Tests\\Fixtures\\Names\\Chat\\{$model}",
            $heredoc,
            'your tasks are done',
        ];
    }

    public function resolved(): object
    {
        app('Tests\Fixtures\Names\Chat\Message');

        return resolve('\Tests\Fixtures\Names\Chat\Message');
    }
}
