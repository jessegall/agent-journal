<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;

/**
 * A model, an enum or an attribute sits in the folder of its subject or kind, such as app/Models/Messages/Message.php,
 * app/Enums/Accounts/AccountState.php or app/Attributes/Commands/Authorize.php, never directly in app/Models, app/Enums
 * or app/Attributes (user messages 22317, 22006).
 */
final class SubjectFoldersTest extends TestCase
{
    /**
     * @return array<string, array{string}>
     */
    public static function folders(): array
    {
        return [
            'models' => ['Models'],
            'enums' => ['Enums'],
            'attributes' => ['Attributes'],
        ];
    }

    #[DataProvider('folders')]
    public function test_nothing_sits_directly_in_the_folder(string $folder): void
    {
        $loose = array_map(basename(...), glob(app_path("{$folder}/*.php")) ?: []);

        $this->assertSame([], $loose);
    }
}
