var availableMemory = [{ startAddress: 0, endAddress: 199, size: 200 }];
var allocatedMemory = [];

function updateMemoryLists() {
  var availableMemoryList = document.getElementById("available-memory");
  var allocatedMemoryList = document.getElementById("allocated-memory");

  availableMemoryList.innerHTML = "";
  allocatedMemoryList.innerHTML = "";

  for (var i = 0; i < availableMemory.length; i++) {
    var block = availableMemory[i];
    var li = document.createElement("li");
    li.innerHTML =
      "Bloque de memoria disponible desde " +
      block.startAddress +
      " hasta " +
      block.endAddress +
      " (" +
      block.size +
      " bytes)";
    availableMemoryList.appendChild(li);
  }

  for (var i = 0; i < allocatedMemory.length; i++) {
    var block = allocatedMemory[i];
    var li = document.createElement("li");
    li.innerHTML =
      "Memoria asignada al proceso " +
      i +
      " desde " +
      block.startAddress +
      " hasta " +
      block.endAddress +
      " (" +
      block.size +
      " bytes)";
    allocatedMemoryList.appendChild(li);
  }
}

function assignMemory() {
  var processSize = parseInt(
    prompt("Ingrese el tamaño del proceso a asignar en bytes: ")
  );
  var memoryAssigned = false;

  for (var i = 0; i < availableMemory.length; i++) {
    if (availableMemory[i].size >= processSize) {
      var block = {
        startAddress: availableMemory[i].startAddress,
        endAddress: availableMemory[i].startAddress + processSize - 1,
        size: processSize,
      };
      availableMemory[i].startAddress += processSize;
      availableMemory[i].size -= processSize;
      allocatedMemory.push(block);
      if (availableMemory[i].size === 0) {
        availableMemory.splice(i, 1);
      }
      memoryAssigned = true;
      break;
    }
  }

  if (memoryAssigned) {
    updateMemoryLists();
    alert(
      "Memoria asignada al proceso " +
        (allocatedMemory.length - 1) +
        " exitosamente."
    );
  } else {
    alert("No hay suficiente memoria disponible para asignar al proceso.");
  }
}

function freeMemory() {
  var processId = parseInt(
    prompt("Ingrese el ID del proceso para liberar memoria: ")
  );

  if (processId >= 0 && processId < allocatedMemory.length) {
    var block = allocatedMemory[processId];
    allocatedMemory.splice(processId, 1);
    var memoryMerged = false;
    for (var i = 0; i < availableMemory.length; i++) {
      if (availableMemory[i].endAddress + 1 === block.startAddress) {
        availableMemory[i].endAddress = block.endAddress;
        availableMemory[i].size += block.size;
        memoryMerged = true;
        break;
      } else if (block.endAddress + 1 === availableMemory[i].startAddress) {
        availableMemory[i].startAddress = block.startAddress;
        availableMemory[i].size += block.size;
        memoryMerged = true;
        break;
      }
    }
    if (!memoryMerged) {
      availableMemory.push({
        startAddress: block.startAddress,
        endAddress: block.endAddress,
        size: block.size,
      });
    }
    updateMemoryLists();
    alert("Memoria del proceso " + processId + " liberada exitosamente.");
  } else {
    alert("No se encontró un proceso con el ID especificado.");
  }
}

document
  .getElementById("assign-memory-button")
  .addEventListener("click", assignMemory);
document
  .getElementById("free-memory-button")
  .addEventListener("click", freeMemory);

updateMemoryLists();
