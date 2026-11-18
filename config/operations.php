<?php

declare(strict_types=1);

return [

    /*
    | The operation names trusted owners declare, which a profile may grant, remove or deny by name. A profile proposal
    | cannot add to this list.
    */
    'names' => [
        'shell:git.push',
        'shell:journal-check.cleanup',
        'tool:journal.web_read',
    ],

];
