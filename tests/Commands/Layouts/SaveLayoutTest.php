<?php

declare(strict_types=1);

namespace Tests\Commands\Layouts;

use App\Commands\Layouts\SaveLayout\SaveLayoutCommand;
use App\Data\Layouts\LayoutShape;
use App\Models\Records\Layout;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A user saves the screen's layout under a name, kept as theirs with its shape.
 */
final class SaveLayoutTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_saved_layout_is_kept_as_the_users_with_its_shape(): void
    {
        $this->journal->owner();

        $this->journal->run(new SaveLayoutCommand('Writing', LayoutShape::from(self::shape('chat'))));

        $layout = Layout::query()->sole();
        $this->assertSame(['Writing', $this->journal->ownerUser()->id], [$layout->name, $layout->user_id]);
        $this->assertSame(['chat'], $layout->shape->grid->windows);
    }

    /**
     * @return array<string, mixed>
     */
    public static function shape(string $window): array
    {
        return [
            'grid' => ['type' => 'pane', 'id' => 'pane-1', 'windows' => [$window], 'active' => $window, 'isWidthLimited' => false],
            'detached' => [],
        ];
    }
}
