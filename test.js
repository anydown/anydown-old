import test from 'ava';
import * as compiler from './src/renderer/kanban-compiler';


test(t => {
	const kanbanInput = "kanban\n# TODO\n* タスク\n# DONE\n* test1\n* test2\n* test3\n"
	const kanbanCompiled = compiler.compileKanban(kanbanInput)
	const expected = [
		{ name: 'TODO', cards: ['タスク'] },
		{ name: 'DONE', cards: ['test1', 'test2', 'test3'] }
	];
	t.deepEqual(kanbanCompiled, expected);
});


test(t => {
	const kanbanData = [
		{ name: 'TODO', cards: ['タスク'] },
		{ name: 'DONE', cards: ['test1', 'test2', 'test3'] }
	];
	const kanbanSerialized = compiler.serializeKanban(kanbanData)
	const kanbanSource = "kanban\n# TODO\n* タスク\n# DONE\n* test1\n* test2\n* test3\n"
	t.deepEqual(kanbanSerialized, kanbanSource);
});
