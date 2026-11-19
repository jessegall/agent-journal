<?php

declare(strict_types=1);

namespace Tests\Unit\Autoload;

use App\Autoload\Support\FolderClasses;
use App\Bus\Contracts\Command;
use App\Mcp\Tools\JournalTool;
use App\Mcp\Tools\OverviewReadTool;
use Domain\Chat\Commands\PinMessage;
use Illuminate\Console\Command as ConsoleCommand;
use Tests\TestCase;

/**
 * A folder's classes of one type are found from the folder, in a domain package as in Core, and an abstract base
 * beside them is left out.
 */
final class FolderClassesTest extends TestCase
{
    public function test_every_class_of_the_type_in_the_folder_is_found_by_name(): void
    {
        $commands = FolderClasses::in(base_path('domain/Chat/src/Commands'), Command::class);

        $this->assertCount(count(glob(base_path('domain/Chat/src/Commands/*.php')) ?: []), $commands);
        $this->assertContains(PinMessage::class, $commands);
        $this->assertSame($commands, array_values(array_unique([...$commands])));
    }

    public function test_an_abstract_base_and_a_class_of_another_type_are_left_out(): void
    {
        $tools = FolderClasses::in(app_path('Mcp/Tools'), JournalTool::class);

        $this->assertContains(OverviewReadTool::class, $tools);
        $this->assertNotContains(JournalTool::class, $tools);
        $this->assertSame([], FolderClasses::in(app_path('Mcp/Tools'), ConsoleCommand::class));
    }
}
